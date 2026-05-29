import AsyncStorage from '@react-native-async-storage/async-storage';
import { DoctorResponse } from '../DoctorService';
import { STORAGE_KEYS } from './keys';

export async function getCachedDoctors(): Promise<DoctorResponse[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.DOCTORS_CACHE);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as DoctorResponse[];
  } catch {
    return [];
  }
}

export async function setCachedDoctors(doctors: DoctorResponse[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.DOCTORS_CACHE, JSON.stringify(doctors));
}
