import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { View } from 'react-native';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
export const MyLoader = () => (
  <ContentLoader
    animate={true}
    speed={2}
    width={width * 0.6}
    height={400}
    viewBox="0 0 400 460"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <Rect x="0" y="0" rx="2" ry="2" width="400" height="400" />
    <Rect x="20" y="320" rx="2" ry="2" width="360" height="20" />
    <Rect x="20" y="350" rx="2" ry="2" width="280" height="20" />
    <Rect x="20" y="380" rx="2" ry="2" width="160" height="20" />
  </ContentLoader>
);
