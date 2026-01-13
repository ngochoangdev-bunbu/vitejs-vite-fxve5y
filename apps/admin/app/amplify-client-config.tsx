'use client';

import { Amplify } from 'aws-amplify';
import outputs from '@repo/amplify-backend/amplify_outputs.json';

Amplify.configure(outputs, {
  ssr: true
});

export function ConfigureAmplifyClientSide() {
  return null;
}