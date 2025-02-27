import { View, XStack, Separator, ScrollView, Button } from 'tamagui';

import {
	BadgePoundSterling,
} from '@tamagui/lucide-icons';

import { TamaHero, TamaCard, LottieHero, useBBQ } from '@kbve/expo-bbq';


function HomeCards() {
	return (
		<XStack $sm={{ flexDirection: 'column' }} paddingHorizontal="$4" space>
			<TamaCard
				title="Consulting"
				paragraph="Discover innovative solutions with LaMorte Consults, a versatile consulting firm specializing in groundbreaking construction projects and cutting-edge website design."
				buttonText="Read More!"
				animation="bouncy"
				size="$2"
				width={300}
				height={300}
				scale={0.9}
				hoverStyle={{ scale: 0.925 }}
				pressStyle={{ scale: 0.875 }}
				linker="/services"
				image="https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=300&auto=format&fit=crop"
			/>

			<TamaCard
				title="About Us"
				paragraph="Check out our cool projects"
				buttonText="Read More!"
				animation="bouncy"
				size="$4"
				width={300}
				height={300}
				scale={0.9}
				hoverStyle={{ scale: 0.925 }}
				pressStyle={{ scale: 0.875 }}
				linker="/about"
				image="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=300&auto=format&fit=crop"
			/>

			<TamaCard
				title="Support"
				paragraph="First in Class Support! Skill issue?"
				buttonText="Read More!"
				animation="bouncy"
				size="$4"
				width={300}
				height={300}
				scale={0.9}
				hoverStyle={{ scale: 0.925 }}
				pressStyle={{ scale: 0.875 }}
				linker="/support"
				image="https://images.unsplash.com/photo-1711117479774-5102ba0eee19?q=80&w=300&auto=format&fit=crop"
			/>

			<TamaCard
				title="Projects"
				paragraph="Check out our cool projects"
				buttonText="Read More!"
				animation="bouncy"
				size="$4"
				width={300}
				height={300}
				scale={0.9}
				hoverStyle={{ scale: 0.925 }}
				pressStyle={{ scale: 0.875 }}
				linker="/projects"
				image="https://images.unsplash.com/photo-1541976844346-f18aeac57b06?q=80&w=300&auto=format&fit=crop"
			/>
		</XStack>
	);
}

export default function IndexScreen() {
	const bbq = useBBQ();

	const handlePress = async (route: string, params?: Record<string, any>) => {
		bbq.go(route, params);
	};

	return (
		<ScrollView>
			<View flex={1} flexGrow={1} alignItems="center">
				<LottieHero
					lottieJSON={require('../../../assets/json/360-vr.json')}
					backgroundImage={require('../../../assets/mask/unsplash_anime.jpg')}
					title="Welcome to LC Agents!"
					description="Yessir"
					opacity={0.9}>
						
					<Button
						iconAfter={BadgePoundSterling}
						size="$3"
						onPress={() => handlePress('/register')}>
						Register
					</Button>

					<Button
						iconAfter={BadgePoundSterling}
						size="$3"
						onPress={() => handlePress('/login')}>
						Login
					</Button>

					<Button
						iconAfter={BadgePoundSterling}
						size="$3"
						onPress={() => handlePress('/consulting')}>
						Consulting
					</Button>
				
				
				</LottieHero>
			</View>
			<Separator marginVertical={15} />
			<View flex={1} alignItems="center">
				<TamaHero
					backgroundImageUri="https://images.unsplash.com/photo-1711029028695-6db032f5c476?q=80&w=2056&auto=format&fit=crop"
					title="LaMorte Consults LLC"
					description="L & C Agency"
					buttonOneText="Contact"
					buttonTwoText="Support"
					onButtonOnePress={() => handlePress('/contact')}
					onButtonTwoPress={() =>
						handlePress('https://kbve.com/support', {
							discord: 'discord',
						})
					}
				/>
				<Separator marginVertical={15} />
				<HomeCards />
			</View>
			<Separator marginVertical={15} />
		</ScrollView>
	);
}
