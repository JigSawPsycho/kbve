use godot::prelude::*;
use papaya::HashMap;
use godot::classes::{ Texture2D, CanvasLayer, Control, AudioStream };
use std::sync::Arc;
use std::marker::PhantomData;
use crate::data::shader_data::ShaderCache;

pub struct ResourceCache<T: GodotClass> {
  map: HashMap<String, Gd<T>>,
  _marker: PhantomData<T>,
}

impl<T: GodotClass> ResourceCache<T> {
  pub fn new() -> Self {
    Self {
      map: HashMap::new(),
      _marker: PhantomData,
    }
  }

  pub fn insert(&self, key: &str, object: Gd<T>) {
    self.map.pin().insert(key.to_string(), object);
  }

  pub fn get(&self, key: &str) -> Option<Gd<T>> {
    self.map.pin().get(&key.to_string()).cloned()
  }

  pub fn get_arc(&self, key: &str) -> Option<Arc<Gd<T>>> {
    self.map
      .pin()
      .get(&key.to_string())
      .map(|gd| Arc::new(gd.clone()))
  }

  pub fn contains(&self, key: &str) -> bool {
    self.map.pin().contains_key(&key.to_string())
  }

  pub fn insert_upcast<U>(&self, key: &str, object: Gd<U>) where U: Inherits<T> + GodotClass {
    self.insert(key, object.upcast::<T>());
  }

  pub fn get_as<U>(&self, key: &str) -> Option<Gd<U>> where U: Inherits<T> + GodotClass {
    self.get(key)?.try_cast::<U>().ok()
  }

  pub fn remove(&self, key: &str) -> Option<Gd<T>> {
    self.map.pin().remove(&key.to_string()).cloned()
  }
}

#[derive(GodotClass)]
#[class(base = Node)]
pub struct CacheManager {
  base: Base<Node>,
  texture_cache: ResourceCache<Texture2D>,
  canvas_layer_cache: ResourceCache<CanvasLayer>,
  ui_cache: ResourceCache<Control>,
  audio_cache: ResourceCache<AudioStream>,
  shader_cache: Gd<ShaderCache>,
}

#[godot_api]
impl INode for CacheManager {
  fn init(base: Base<Self::Base>) -> Self {
    let shader_cache = Gd::from_init_fn(|base| ShaderCache::init(base));

    Self {
      base,
      texture_cache: ResourceCache::new(),
      canvas_layer_cache: ResourceCache::new(),
      ui_cache: ResourceCache::new(),
      audio_cache: ResourceCache::new(),
      shader_cache,
    }
  }

  fn ready(&mut self) {
    let shader_cache = self.shader_cache.clone();

    {
      let mut base = self.base_mut();
      base.add_child(&shader_cache.upcast::<Node>());
    }
  }
}

#[godot_api]
impl CacheManager {
  fn internal_canvas_layer_cache(&self) -> &ResourceCache<CanvasLayer> {
    &self.canvas_layer_cache
  }

  fn internal_ui_cache(&self) -> &ResourceCache<Control> {
    &self.ui_cache
  }

  fn internal_texture_cache(&self) -> &ResourceCache<Texture2D> {
    &self.texture_cache
  }

  pub fn internal_audio_cache(&self) -> &ResourceCache<AudioStream> {
    &self.audio_cache
  }

  fn internal_shader_cache(&self) -> &Gd<ShaderCache> {
    &self.shader_cache
  }

  fn internal_shader_cache_as_node(&self) -> Gd<Node> {
    self.shader_cache.clone().upcast::<Node>()
  }

  #[func]
  fn get_from_canvas_layer_cache(&self, key: GString) -> Option<Gd<CanvasLayer>> {
    self.canvas_layer_cache.get(key.to_string().as_str())
  }

  #[func]
  fn get_from_ui_cache(&self, key: GString) -> Option<Gd<Control>> {
    self.ui_cache.get(key.to_string().as_str())
  }

  #[func]
  fn get_from_texture_cache(&self, key: GString) -> Option<Gd<Texture2D>> {
    self.texture_cache.get(key.to_string().as_str())
  }

  #[func]
  fn get_from_audio_cache(&self, key: GString) -> Option<Gd<AudioStream>> {
    self.audio_cache.get(key.to_string().as_str())
  }

  #[func]
  fn obtain_shader_cache(&self) -> Gd<ShaderCache> {
    self.shader_cache.clone()
  }
}
