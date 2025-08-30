import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/store/reducers/authSlice";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        loginUser({ email: form.email, password: form.password })
      ).unwrap();
      navigate("/cars");
    } catch (err) {
      console.error("Login failed:", err);
      alert(err);
    }
  };

  return (
    <div className="p-3 md:p-0 h-full flex flex-col gap-5 items-start">
       <Button className="ml-4 mt-5" onClick={()=> navigate('/auth/register')}>to register</Button>
      <div className="max-w-md md:w-[400px] mx-auto p-5 border rounded-md shadow">
        <h2 className="text-2xl mb-5">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
