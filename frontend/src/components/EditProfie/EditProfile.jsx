import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { logout } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const user = useSelector((state) => state.auth.userData);
  const [username, setUsername] = useState(user?.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null); // For image preview
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUsernameEmailChange = async () => {
    // Dispatch an action to update username and email
  };

  const handlePasswordChange = async () => {
    // Dispatch an action to update password
    let data = {
      oldPassword,
      newPassword: password,
    };
    let res = await axios.patch("/api/v1/user/update-password", data);
    toast({
      description: res.data.message,
    });
    setOldPassword("");
    setPassword("");
  };

let handleAvatarChange = async () => {
    // Dispatch an action to update avatar

    let formData = new FormData();
    formData.append("avatar", avatar);
    let res = await axios.patch("/api/v1/user/update-avatar", formData);
    toast({
      description: res?.data?.message,
    });
    setAvatar(null);
    setAvatarPreview(null);
  };

  const handleLogout = async () => {
    let res = await axios.get("/api/v1/user/logout");
    if (res?.data?.status === true) {
      dispatch(logout());
    }
    toast({
      description: res.data.message,
    });
    window.location.reload();
    
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Avatar>
            <AvatarImage className="cursor-pointer " src={user.avatar} />
            <AvatarFallback>{user?.username}</AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <SheetContent side={"bottom"}>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-2 py-4">
            <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Username
              </Label>
              <Input
                id="name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
              />
              <Button onClick={handleUsernameEmailChange} type="submit">
                Save username/email
              </Button>
            </div>
            <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="oldPassword" className="text-right">
                Old Password
              </Label>
              <Input
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
              />
              <Button onClick={handlePasswordChange} type="submit">
                Save password
              </Button>
            </div>
            <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="avatar" className="text-right">
                Avatar
              </Label>
              <Input
                id="avatar"
                type="file"
                onChange={(e) => {
                  setAvatar(e.target.files[0]);
                  handleImagePreview(e);
                }}
                className="col-span-3"
              />
              <Button onClick={handleAvatarChange} type="submit">
                Save avatar
              </Button>
            </div>
          </div>
          {avatarPreview && (
            <div className="flex justify-center">
              <img
                className="max-w-40 max-h-40 object-contain"
                src={avatarPreview}
                alt="Avatar Preview"
              />
            </div>
          )}
          <Button className="my-4 w-full" onClick={handleLogout}>
            Logout
          </Button>
        </SheetContent>
      </Sheet>
      <Toaster />
    </div>
  );
}

export default EditProfile;
