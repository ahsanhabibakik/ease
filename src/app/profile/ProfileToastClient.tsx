"use client";
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function ProfileToastClient() {
  const params = useSearchParams();
  useEffect(()=>{
    if (params.get('logged') === '1') {
      toast.success('Signed in successfully');
    }
  },[params]);
  return null;
}
