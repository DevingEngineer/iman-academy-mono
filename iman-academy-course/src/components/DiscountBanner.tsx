import BannerMoon from '@/public/images/discount-banner/banner-moon.jpg'
import Stars from '@/public/images/discount-banner/stars.png'
import Image from 'next/image'

export const DiscountBanner = () => {
	return (
		<section className='relative pt-9 pb-[41px] bg-[linear-gradient(90deg,#091E3A_0%,#091E3A_2%,#2F80ED_55%,#2D9EE0_100%)] overflow-hidden w650:pt-11'>
			<div className='container relative'>
				<Image
					src={BannerMoon}
					alt='discount-banner-moon'
					width={410}
					height={410}
					className='absolute -top-[80px] left-[38px] w1350:left-0 w1250:w-[200px] w1250:h-[200px] w1250:-top-0 w650:w-[100px] w650:h-[100px] w650:top-[100px]'
				/>

				<div className='w650:max-w-[400px] m-auto'>
					<h2 className='h1 text-center text-white'>
						Персональная скидка ,банер
					</h2>
					<p className='text-center mt-5 text-white'>
						+10% к акциям на сайте — на все курсы <br /> и интенсивы школы
					</p>
				</div>
			</div>
			<Image
				src={Stars}
				alt='discount-banner-'
				width={400}
				height={400}
				className='absolute -top-[5px] -right-32 w1250:w-[200px] w1250:h-[200px] w1250:-right-[65px] w1250:top-[80px] w650:w-[100px] w650:h-[100px] w650:-top-5 w650:-right-[35px]'
			/>
		</section>
	)
}
