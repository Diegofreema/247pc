import axios from 'axios';
import * as StoreReview from 'expo-store-review';
import { api } from './contants';

export const trimTitle = (title: string) => {
  const [firstWord, secondWord, thirdWord, fourthWord, ...remainingWords] =
    title.split(' ');
  if (remainingWords.length > 0) {
    return `${firstWord} ${secondWord} ${thirdWord} ${fourthWord}...`;
  }
  return title;
};

export const getProfile = async (id: any) => {
  const { data } = await axios.get(`${api}=userinfo&myuserid=${id}`);

  return data;
};

export const Cats = [
  {
    name: 'Pharmacy',
    id: '0',
    products: [],
  },
  {
    name: 'Skincare',
    id: '1',
    products: [],
  },
  {
    name: 'Toiletries',
    id: '2',
    products: [],
  },
  {
    name: 'Natural Healthcare',
    id: '3',
    products: [],
  },
  {
    name: 'Beauty',
    id: '4',
    products: [],
  },
  {
    name: 'Fragrance & Gift',
    id: '5',
    products: [],
  },
  {
    name: 'Mother & Baby',
    id: '6',
    products: [],
  },
];

export const subCats = [
  [
    {
      category: 'Allergy Relief',
      img: require('../assets/images/Pharmacy/all.jpg'),
    },
    {
      category: "Children's Medicine",
      img: require(`../assets/images/Pharmacy/Children.jpg`),
    },
    {
      category: 'Cold & Flu',
      img: require('../assets/images/Pharmacy/Cold.jpg'),
    },
    {
      category: 'Eye & Ear Care',
      img: require('../assets/images/Pharmacy/Eye.jpg'),
    },
    {
      category: 'First Aid',
      img: require('../assets/images/Pharmacy/First.jpg'),
    },
    {
      category: 'Foot & Nail Care',
      img: require('../assets/images/Pharmacy/Foot.jpg'),
    },
    {
      category: 'Medical Devices',
      img: require('../assets/images/Pharmacy/netpro.jpg'),
    },
    {
      category: 'Medicated Skincare',
      img: require('../assets/images/Pharmacy/Medical.jpg'),
    },
    {
      category: 'Multivitamins',
      img: require('../assets/images/Pharmacy/Multivitamins.jpg'),
    },
    {
      category: 'Nicotine Replacement',
      img: require('../assets/images/Pharmacy/Nicotine.jpg'),
    },
    {
      category: 'Oral Health',
      img: require('../assets/images/Pharmacy/Oral.jpg'),
    },
    {
      category: 'Pain Relief',
      img: require('../assets/images/Pharmacy/Pain.jpg'),
    },
    {
      category: 'Sensitive Conditions',
      img: require('../assets/images/Pharmacy/Sensitive.jpg'),
    },
    {
      category: 'Sexual Health',
      img: require('../assets/images/Pharmacy/Sexual.jpg'),
    },
    {
      category: 'Stomach & Digestion',
      img: require('../assets/images/Pharmacy/Stomach.jpg'),
    },
    {
      category: "Women's Health",
      img: require('../assets/images/Pharmacy/Women.jpg'),
    },
  ],
  [
    {
      category: 'Body Care',
      img: require('../assets/images/SKINCARE/Body.jpg'),
    },
    {
      category: 'Cleanse',
      img: require('../assets/images/SKINCARE/Cleanse.jpg'),
    },
    {
      category: 'Eye Care',
      img: require('../assets/images/SKINCARE/Eye.jpg'),
    },
    {
      category: 'Face',
      img: require('../assets/images/SKINCARE/Face.jpg'),
    },
    {
      category: 'Hands & Feet',
      img: require('../assets/images/SKINCARE/Hands.jpg'),
    },
    {
      category: 'Masks & Peels',
      img: require('../assets/images/SKINCARE/Masks.jpg'),
    },
    {
      category: "Men's Skincare",
      img: require('../assets/images/SKINCARE/Men.jpg'),
    },
    {
      category: 'Sun Care & SPF',
      img: require('../assets/images/SKINCARE/Sun.jpg'),
    },
  ],
  [
    {
      category: 'Bath & Shower',
      img: require('../assets/images/TOILETRIES/Bath.jpg'),
    },
    {
      category: 'Dental',
      img: require('../assets/images/TOILETRIES/dental.jpg'),
    },

    {
      category: 'Deodorant',
      img: require('../assets/images/TOILETRIES/deodorant.jpg'),
    },
    {
      category: 'Electrical',
      img: require('../assets/images/TOILETRIES/electrical.jpg'),
    },
    {
      category: 'Feminine Care',
      img: require('../assets/images/TOILETRIES/feminine.jpg'),
    },
    {
      category: 'Hair Care',
      img: require('../assets/images/TOILETRIES/hair.jpg'),
    },
    {
      category: 'Hair Removal',
      img: require('../assets/images/hair.jpg'),
    },
    {
      category: 'Handsoap & Sanitiser',
      img: require('../assets/images/TOILETRIES/handsoap.jpg'),
    },
    {
      category: 'Masks, Gloves & PPE',
      img: require('../assets/images/TOILETRIES/masks.jpg'),
    },
    {
      category: "Men's Grooming",
      img: require('../assets/images/TOILETRIES/men.jpg'),
    },
    {
      category: 'Travel',
      img: require('../assets/images/TOILETRIES/travel.jpg'),
    },
  ],
  [
    {
      category: 'Sexual Health',
      img: require('../assets/images/nature/Sexual.jpg'),
    },
    {
      category: 'Brain Health & Omega Oils',
      img: require('../assets/images/nature/brainhealth.jpg'),
    },
    {
      category: "Children's Vitamins",
      img: require('../assets/images/nature/children.jpg'),
    },
    {
      category: 'Energy & Vitality',
      img: require('../assets/images/nature/energy.jpg'),
    },
    {
      category: 'Eye & Ear',
      img: require('../assets/images/ear.jpg'),
    },
    {
      category: 'Health Foods',
      img: require('../assets/images/nature/healthyfood.jpg'),
    },
    {
      category: 'Healthy Heart',
      img: require('../assets/images/nature/healthyhearts.jpg'),
    },
    {
      category: 'Immune Support',
      img: require('../assets/images/nature/immune.jpg'),
    },
    {
      category: "Men's Wellbeing",
      img: require('../assets/images/men.png'),
    },
    {
      category: 'Muscles, Joint & Bone',
      img: require('../assets/images/nature/muscle.jpg'),
    },
    {
      category: 'Other Vitamins',
      img: require('../assets/images/nature/other.jpg'),
    },
    {
      category: 'Probiotics & Gut',
      img: require('../assets/images/nature/probiotics.jpg'),
    },
    {
      category: 'Sleep & Stress',
      img: require('../assets/images/nature/sleep.jpg'),
    },
    {
      category: 'Weight Management',
      img: require('../assets/images/nature/weight.jpg'),
    },
    {
      category: "Women's Wellbeing",
      img: require('../assets/images/nature/Women.jpg'),
    },
  ],
  [
    {
      category: 'Brows & Lashes',
      img: require('../assets/images/brows.png'),
    },
    {
      category: 'Brushes & Brushes',
      img: require('../assets/images/BEAUTY/BrushesAccessories.jpg'),
    },
    {
      category: 'Eyes',
      img: require('../assets/images/BEAUTY/Eyes.jpg'),
    },
    {
      category: 'Faces',
      img: require('../assets/images/BEAUTY/Facefemale.jpg'),
    },
    {
      category: 'Lips',
      img: require('../assets/images/BEAUTY/Lips.jpg'),
    },
    {
      category: 'Nails',
      img: require('../assets/images/BEAUTY/Nails.jpg'),
    },
    {
      category: 'Tanning',
      img: require('../assets/images/BEAUTY/Tanning.jpg'),
    },
  ],
  [
    {
      category: 'Candles & Diffusers',
      img: require('../assets/images/frag/candles.jpg'),
    },
    {
      category: 'Christmas Shop',
      img: require('../assets/images/frag/christmas.jpg'),
    },
    {
      category: "Men's Fragrance",
      img: require('../assets/images/frag/men_s.jpg'),
    },
    {
      category: "Women's Fragrance",
      img: require('../assets/images/frag/women.jpg'),
    },
    {
      category: 'Hampers',
      img: require('../assets/images/frag/hampers.jpg'),
    },
    {
      category: 'Mothers Day Gift',
      img: require('../assets/images/frag/mother.jpg'),
    },
  ],
  [
    {
      category: 'Baby Health',
      img: require('../assets/images/baby/babyhealth.jpg'),
    },
    {
      category: 'Baby Wipe & Changing',
      img: require('../assets/images/baby/babywipeschanging.jpg'),
    },
    {
      category: 'Bathing & Skincare',
      img: require('../assets/images/baby/bathingandskincare.jpg'),
    },
    {
      category: 'Feeding',
      img: require('../assets/images/baby/feeding.jpg'),
    },
    {
      category: 'Maternity Care',
      img: require('../assets/images/baby/maternitycare.jpg'),
    },
    {
      category: 'Soothers & Accessories',
      img: require('../assets/images/baby/soothersandaccessories.jpg'),
    },
  ],
];

export const onReview = async () => {
  if (await StoreReview.hasAction()) {
    await StoreReview.requestReview();
  }
};

export const refetchDeliveryFee = async (
  id: string,
  productInCart: string,
  communityId: string
) => {
  return await axios.post(
    `${api}=cartpageload&productincart=${productInCart}&myuserid=${id}&communityId=${communityId}`
  );
};

export const generateFiveRandomNumber = () => {
  let token = '';
  for (let i = 0; i < 5; i++) {
    token += Math.floor(Math.random() * 10);
  }
  return token;
};
