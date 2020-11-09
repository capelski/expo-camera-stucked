import { Camera, CameraCapturedPicture } from "expo-camera";
import * as Permissions from "expo-permissions";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const getPermission = async (permission: Permissions.PermissionType) => {
  const { status: existingStatus } = await Permissions.getAsync(permission);
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Permissions.askAsync(permission);
    finalStatus = status;
  }
  return finalStatus === "granted";
};

export default () => {
  const [arePermissionsGranted, setArePermissionsGranted] = useState(false);
  const [picture, setPicture] = useState<CameraCapturedPicture>();
  const [isLoading, setIsLoading] = useState(false);
  const camera = useRef<Camera>(null);

  useEffect(() => {
    getPermission(Permissions.CAMERA)
      .then((permission) => {
        if (permission) {
          setArePermissionsGranted(true);
        } else {
          alert("Gonna need those permissions to proceed");
        }
      })
      .catch((_error) => {
        alert("Missing required permissions");
      });
  }, []);

  const takePicture = () => {
    if (camera.current) {
      setIsLoading(true);
      camera.current
        .takePictureAsync({
          quality: 0.5,
        })
        .then(setPicture)
        .catch((_error) => {
          console.log("How unfair life is sometimes");
        })
        .finally(() => setIsLoading(false));
    }
  };

  return arePermissionsGranted ? (
    picture ? (
      <View style={styles.container}>
        <Text style={styles.text}>Picture captured!</Text>
        <TouchableOpacity onPress={() => setPicture(undefined)}>
          <Text style={styles.text}>Repeat</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <Camera
        ref={camera}
        style={{ flex: 1, width: "100%" }}
        type={Camera.Constants.Type.back}
      >
        <View style={styles.container}>
          {isLoading ? (
            <Text style={styles.text}>Working on it...</Text>
          ) : (
            <TouchableOpacity onPress={takePicture}>
              <Text style={styles.text}>Take picture</Text>
            </TouchableOpacity>
          )}
        </View>
      </Camera>
    )
  ) : (
    <View style={styles.container}>
      <Text style={styles.text}>Initializing...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 32,
  },
});
