import {
	Button,
	Card,
	Image,
	XStack,
	YStack,
	H1,
	Paragraph,
} from 'tamagui';


interface TamaHeroProps {
	backgroundImageUri: string;
	title: string;
	description: string;
	buttonOneText: string;
	buttonTwoText: string;

	onButtonOnePress?: () => void;
	onButtonTwoPress?: () => void;
}

export function TamaHero({
	backgroundImageUri,
	title,
	description,
	buttonOneText,
	buttonTwoText,

	onButtonOnePress,
	onButtonTwoPress,
}: TamaHeroProps) {
	return (
		<Card
			elevate
			style={{
				width: '100%',
				height: '750',
				overflow: 'hidden',
				position: 'relative',
			}}>
			<Image
				source={{ uri: backgroundImageUri }}
				style={{ width: '100%', height: '100%', position: 'absolute' }}
				objectFit="cover"
			/>
			<YStack
				space
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					padding: 20,
					backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add a dark overlay to ensure text is readable
				}}>
				<H1 color="white" style={{ textAlign: 'center' }}>
					{title}
				</H1>
				<Paragraph theme="alt2" color="white" style={{
						color: 'white',
						textAlign: 'center',
						margin: '10px 0',
					}}>
					
					{description}
				</Paragraph>
				<XStack space="$2" alignItems="center">
					<Button onPress={onButtonOnePress}>{buttonOneText}</Button>
					<Button onPress={onButtonTwoPress}>{buttonTwoText}</Button>
				</XStack>
			</YStack>
		</Card>
	);
}