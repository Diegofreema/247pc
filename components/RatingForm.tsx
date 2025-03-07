import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { AirbnbRating } from 'react-native-ratings';
import { colors } from '../constants/Colors';
import { useComment } from '../lib/mutation';
import { MyButton } from './MyButton';

type Props = {
  productId: string;
};

export const RatingForm = ({ productId }: Props): JSX.Element => {
  const [comment, setComment] = useState('');
  const { mutateAsync, isPending } = useComment();
  const [rating, setRating] = useState(0);
  console.log('🚀 ~ order ~ comment:', comment);
  const onRatingCompleted = (value: number) => {
    console.log('🚀 ~ ratingCompleted ~ rating:', value);
    setRating((prevRating) => (prevRating = value));
  };
  const isEmpty = comment === '' && rating === 0;

  const onSubmit = () => {
    if (isEmpty) return;
    mutateAsync({ comment, rating, productId });
    setComment('');
    setRating(0);
  };
  return (
    <View style={{ gap: 5 }}>
      <Text style={styles.label}>How would you rate this product</Text>
      <AirbnbRating
        count={5}
        defaultRating={rating}
        size={20}
        onFinishRating={onRatingCompleted}
        showRating={false}
        ratingContainerStyle={{
          alignItems: 'flex-start',
        }}
      />

      <TextInput
        maxLength={500}
        autoCapitalize="sentences"
        placeholder="Please share your experience..."
        onChangeText={setComment}
        value={comment}
        placeholderTextColor={'black'}
        multiline
        numberOfLines={3}
        //   style={styles.message}
        contentStyle={styles.message}
        outlineColor="transparent"
      />
      <MyButton
        text="Submit"
        onPress={onSubmit}
        buttonColor={colors.lightGreen}
        loading={isPending}
        textColor={'white'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: 'black',
    fontFamily: 'PoppinsMedium',
    fontSize: 13,
    marginBottom: 10,
  },
  message: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 6,
    color: 'black',
    backgroundColor: 'white',
    fontFamily: 'Poppins',
    fontSize: 13,
  },
});
