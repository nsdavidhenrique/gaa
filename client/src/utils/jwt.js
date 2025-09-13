import * as SecureStore from "expo-secure-store"

// TODO move to services

export async function saveToken(token) {
  await SecureStore.setItemAsync("jwt", token);
}

export async function getToken() {
  return await SecureStore.getItemAsync("jwt");
}

export async function deleteToken() {
  await SecureStore.deleteItemAsync("jwt");
}
