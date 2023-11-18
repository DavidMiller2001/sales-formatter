import { StatusBar } from 'expo-status-bar';
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'expo-camera';
import type { CameraCapturedPicture } from 'expo-camera/build/Camera.types';

const CameraPreview = (props: { photo: CameraCapturedPicture }) => {
  const { photo } = props;
  console.log('photo: ', photo);
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%',
      }}
    >
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default function App() {
  const [startCamera, setStartCamera] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] =
    useState<CameraCapturedPicture | null>(null);

  const __startCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();

    if (status === 'granted') {
      setStartCamera(true);
    } else {
      Alert.alert('Access denied');
    }
  };

  const __takePicture = async () => {
    if (!camera) return;
    const photo = await camera.takePictureAsync();
    setPreviewVisible(true);
    setCapturedImage(photo);
    setStartCamera(false);
  };

  let camera: Camera | null;
  return (
    <View style={styles.container}>
      {startCamera ? (
        <View
          style={{
            flex: 1,
            width: '100%',
          }}
        >
          {previewVisible && capturedImage ? (
            <CameraPreview photo={capturedImage} />
          ) : (
            <Camera
              style={styles.camera}
              ref={(r) => {
                camera = r;
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  flex: 1,
                  width: '100%',
                  padding: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View
                  style={{
                    alignSelf: 'center',
                    flex: 1,
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity
                    onPress={__takePicture}
                    style={{
                      width: 70,
                      height: 70,
                      bottom: 0,
                      borderRadius: 50,
                      backgroundColor: '#fff',
                    }}
                  />
                </View>
              </View>
            </Camera>
          )}
        </View>
      ) : (
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={__startCamera}>
            <Text style={styles.text}>Take a picture</Text>
          </TouchableOpacity>
          <StatusBar style='auto' />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  text: {
    color: '#fff',
  },
  button: {
    borderRadius: 4,
    width: 130,
    height: 40,
    backgroundColor: '#14274e',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
