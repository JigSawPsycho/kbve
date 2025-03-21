use std::{ borrow::Cow, sync::Arc };

use axum::{ body::Bytes, extract::{ Path, State }, http::StatusCode, response::IntoResponse, Json };
use tokio::time::Instant;
use serde::Serialize;
use crate::entity::helper::{ ReadRequest, WriteRequest, CowKeyValueResponse, TTL_DURATION };
use crate::{ entity::state::SharedState, proto::store::StoreValue, handler::error::AppError };
use tokio::sync::oneshot;

#[derive(Serialize)]
struct MessageResponse {
  message: &'static str,
}

pub async fn set_key_raw(
  Path(key): Path<String>,
  State(state): State<SharedState>,
  Json(payload): Json<StoreValue>
) -> Result<impl IntoResponse, AppError> {
  let state_clone = Arc::clone(&state.store);
  let key_clone = key.clone();
  let value_bytes = Bytes::from(payload.value);
  let expires_at = Instant::now() + TTL_DURATION;

  tokio::spawn(async move {
    let db = state_clone.write().await;
    let store = db.store.pin_owned();
    store.insert(key_clone, (value_bytes, expires_at));
  });

  Ok((StatusCode::ACCEPTED, Json(MessageResponse { message: "Key storage in progress" })))
}

pub async fn set_key(
  Path(key): Path<String>,
  State(state): State<SharedState>,
  Json(payload): Json<StoreValue>,
) -> Result<impl IntoResponse, AppError> {
  let expires_at = Instant::now() + TTL_DURATION;

  let write_request = WriteRequest {
    key,
    value: Bytes::from(payload.value),
    expires_at,
  };

  if let Err(e) = state.write_tx.send(write_request).await {
    tracing::error!("Failed to send write request: {}", e);
    return Err(AppError::Internal("Write queue is unavailable".into()));
  }

  Ok((
    StatusCode::ACCEPTED,
    Json(MessageResponse {
      message: "Key storage in progress",
    }),
  ))
}

pub async fn get_key_raw(
  Path(key): Path<String>,
  State(state): State<SharedState>
) -> Result<Json<CowKeyValueResponse<'static>>, AppError> {
  let db = state.store.read().await;
  let store = db.store.pin();

  match store.get(&key) {
    Some((value, _)) => {
      let cow_value: Cow<'static, str> = match std::str::from_utf8(value) {
        Ok(valid_str) => Cow::Owned(valid_str.to_owned()),
        Err(_) => Cow::Owned(String::from_utf8_lossy(value).into_owned()),
      };

      Ok(Json(CowKeyValueResponse { value: cow_value }))
    }
    None => {
      tracing::error!("Key '{}' not found", key);
      Err(AppError::NotFound)
    }
  }
}

pub async fn get_key(
  Path(key): Path<String>,
  State(state): State<SharedState>
) -> Result<Json<CowKeyValueResponse<'static>>, AppError> {
  let (tx, rx) = oneshot::channel();

  let read_req = ReadRequest {
    key: key.clone(),
    response_tx: tx,
  };

  if let Err(err) = state.read_tx.send(read_req).await {
    tracing::error!("Failed to send read request: {}", err);
    return Err(AppError::Internal("Read channel closed".into()));
  }

  match rx.await {
    Ok(Some((value, _expires_at))) => {
      let cow_value: Cow<'static, str> = match std::str::from_utf8(&value) {
        Ok(valid_str) => Cow::Owned(valid_str.to_owned()),
        Err(_) => Cow::Owned(String::from_utf8_lossy(&value).into_owned()),
      };

      Ok(Json(CowKeyValueResponse { value: cow_value }))
    }

    Ok(None) => {
      tracing::error!("Key '{}' not found", key);
      Err(AppError::NotFound)
    }

    Err(err) => {
      tracing::error!("Failed to receive from oneshot: {}", err);
      Err(AppError::Internal("Failed to receive response".into()))
    }
  }
}

pub async fn list_keys(State(state): State<SharedState>) -> Result<Json<Vec<String>>, AppError> {
  match state.store.read().await.store.pin().keys().cloned().collect::<Vec<String>>() {
    keys if !keys.is_empty() => Ok(Json(keys)),
    _ => {
      tracing::error!("Failed to retrieve keys or store is empty.");
      Err(AppError::NotFound)
    }
  }
}

pub async fn clear_store(State(mut state): State<SharedState>) -> Result<
  impl IntoResponse,
  AppError
> {
  let mut store = state.store.write().await;
  store.replace_store();

  Ok((StatusCode::OK, Json(MessageResponse { message: "Key storage in progress" })))
}
