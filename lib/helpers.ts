import axios from 'axios';

export const trimTitle = (title: string) => {
  const [firstWord, secondWord, thirdWord, fourthWord, ...remainingWords] =
    title.split(' ');
  if (remainingWords.length > 0) {
    return `${firstWord} ${secondWord} ${thirdWord} ${fourthWord}...`;
  }
  return title;
};

export const getProfile = async (id: any) => {
  const { data } = await axios.get(
    `https://247api.netpro.software/api.aspx?api=userinfo&myuserid=${id}`
  );

  return data;
};
