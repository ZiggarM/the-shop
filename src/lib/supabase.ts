// import { createClient } from "@supabase/supabase-js";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as SecureStore from 'expo-secure-store';
// import * as aesjs from 'aes-js';
// import 'react-native-get-random-values';
// import { Database } from "../types/database.types";

// // const supabaseUrl = "https://eqmcbbkvlkpcszzbjmuo.supabase.co"
// // const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxbWNiYmt2bGtwY3N6emJqbXVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NzA2NjQsImV4cCI6MjA1OTI0NjY2NH0.TfqxgTO6EGkW8LqWGhAUaT3-jVtq3I7o01fJCm3syvk"

// const supabaseUrl = "http://127.0.0.1:54321"
// const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"

// // As Expo's SecureStore does not support values larger than 2048
// // bytes, an AES-256 key is generated and stored in SecureStore, while
// // it is used to encrypt/decrypt values stored in AsyncStorage.
// class LargeSecureStore {
//   private async _encrypt(key: string, value: string) {
//     const encryptionKey = crypto.getRandomValues(new Uint8Array(256 / 8));

//     const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, new aesjs.Counter(1));
//     const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));

//     await SecureStore.setItemAsync(key, aesjs.utils.hex.fromBytes(encryptionKey));

//     return aesjs.utils.hex.fromBytes(encryptedBytes);
//   }

//   private async _decrypt(key: string, value: string) {
//     const encryptionKeyHex = await SecureStore.getItemAsync(key);
//     if (!encryptionKeyHex) {
//       return encryptionKeyHex;
//     }

//     const cipher = new aesjs.ModeOfOperation.ctr(aesjs.utils.hex.toBytes(encryptionKeyHex), new aesjs.Counter(1));
//     const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value));

//     return aesjs.utils.utf8.fromBytes(decryptedBytes);
//   }

//   async getItem(key: string) {
//     const encrypted = await AsyncStorage.getItem(key);
//     if (!encrypted) { return encrypted; }

//     return await this._decrypt(key, encrypted);
//   }

//   async removeItem(key: string) {
//     await AsyncStorage.removeItem(key);
//     await SecureStore.deleteItemAsync(key);
//   }

//   async setItem(key: string, value: string) {
//     const encrypted = await this._encrypt(key, value);

//     await AsyncStorage.setItem(key, encrypted);
//   }
// }


// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     storage: new LargeSecureStore(),
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   },
// });




// The below code will make the app work on desktop but i am not sure if it actually causes problem in any other way



import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import * as aesjs from 'aes-js';
import { Platform } from 'react-native';
import 'react-native-get-random-values';
// const supabaseUrl = "https://eqmcbbkvlkpcszzbjmuo.supabase.co"
// const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxbWNiYmt2bGtwY3N6emJqbXVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NzA2NjQsImV4cCI6MjA1OTI0NjY2NH0.TfqxgTO6EGkW8LqWGhAUaT3-jVtq3I7o01fJCm3syvk"

const supabaseUrl = process.env.EXPO_PUBLIC__SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC__SUPABASE_ANNON_KEY;

// As Expo's SecureStore does not support values larger than 2048
// bytes, an AES-256 key is generated and stored in SecureStore, while
// it is used to encrypt/decrypt values stored in AsyncStorage.
class LargeSecureStore {
  private async _encrypt(key: string, value: string) {
    const encryptionKey = crypto.getRandomValues(new Uint8Array(32));
    const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, new aesjs.Counter(1));
    const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));

    if (Platform.OS !== 'web') {
      await SecureStore.setItemAsync(key, aesjs.utils.hex.fromBytes(encryptionKey));
    } else {
      localStorage.setItem(`${key}-key`, aesjs.utils.hex.fromBytes(encryptionKey));
    }

    return aesjs.utils.hex.fromBytes(encryptedBytes);
  }

  private async _decrypt(key: string, value: string) {
    let encryptionKeyHex: string | null = null;

    if (Platform.OS !== 'web') {
      encryptionKeyHex = await SecureStore.getItemAsync(key);
    } else {
      encryptionKeyHex = localStorage.getItem(`${key}-key`);
    }

    if (!encryptionKeyHex) {
      return null;
    }

    const cipher = new aesjs.ModeOfOperation.ctr(aesjs.utils.hex.toBytes(encryptionKeyHex), new aesjs.Counter(1));
    const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value));
    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }

  async getItem(key: string) {
    const encrypted = await AsyncStorage.getItem(key);
    if (!encrypted) return null;

    return await this._decrypt(key, encrypted);
  }

  async removeItem(key: string) {
    await AsyncStorage.removeItem(key);
    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync(key);
    } else {
      localStorage.removeItem(`${key}-key`);
    }
  }

  async setItem(key: string, value: string) {
    const encrypted = await this._encrypt(key, value);
    await AsyncStorage.setItem(key, encrypted);
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: new LargeSecureStore(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});