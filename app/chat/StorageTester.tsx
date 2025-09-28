"use client";
import { useEffect } from "react";
import "@/lib/storage"; 

export default function StorageTester() {
  useEffect(() => {
    console.log("Storage tester loaded, window.testStorage disponible");
  }, []);
  return null; 
}
