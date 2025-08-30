import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser } from "@/store/reducers/authSlice";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.passwordConfirm) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await dispatch(registerUser(form)).unwrap();
      navigate("/auth/login");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Registration failed");
    }
  };

  return (
    <div className="p-3 h-full flex flex-col gap-5 items-start">
      <Button className="ml-4 mt-5" onClick={() => navigate("/auth/login")}>
        to login
      </Button>

      <div className="max-w-md mx-auto  md:w-[400px] p-5 border rounded-md shadow">
        <h2 className="text-2xl mb-5">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} />
          </div>
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
          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
}
