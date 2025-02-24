"use client";
import { useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function TestInsert() {
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
      } else {
        console.log("Session data:", data.session);
      }
    };
    checkSession();
  }, []);
  useEffect(() => {
    const testInsert = async () => {
      const sessionRes = await supabase.auth.getSession();
      console.log("Session:", sessionRes.data);
      const payload = {
        user_id: sessionRes.data?.session?.user?.id || "missing",
        title: "Test Title",
        description: "Test Description",
      };
      console.log("Payload:", payload);
      const { data, error } = await supabase
        .from("exhibitions")
        .insert([payload])
        .select("*")
        .single();
      if (error) {
        console.error("Insert error:", error);
      } else {
        console.log("Insert success:", data);
      }
    };
    testInsert();
  }, []);
  return <div>Testing Insert...</div>;
}
