const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "Failed to register User");
  }

  return res.json();
}
export async function loginUser(email: string, password: string) {
        const res=await fetch(`${API_URL}/api/auth/login`,{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            email,
            password
        })
    })
    if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Failed to login User");
    }
    return res.json();
}
