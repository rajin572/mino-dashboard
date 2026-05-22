import { Button } from "@/Components/ui/button";
import Container from "@/Components/ui/CustomUi/Container";
import { FormInput, FormPassword } from "@/Components/ui/CustomUi/ReuseForm/Form";
import { FieldGroup } from "@/Components/ui/field";
import useUserData from "@/hooks/useUserData";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import tryCatchWrapper from "@/utils/tryCatchWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineEmail, MdPassword } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";

const signInSchema = z.object({
    email: z.email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
});

const SignIn = () => {
    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const router = useNavigate();

    const [login] = useLoginMutation();

    const userExist = useUserData();

    useEffect(() => {
        if (userExist?.role === "admin") {
            router("/", { replace: true });
        }
    }, [router, userExist]);

    const onFinish = async (data: z.infer<typeof signInSchema>) => {
        const res = await tryCatchWrapper(login, { body: data }, "Logging In...");
        if (res?.statusCode === 200 && res?.data?.user?.role === "admin") {
            Cookies.remove("minoDashboard_forgetToken");
            Cookies.remove("minoDashboard_forgetEmail");
            Cookies.remove("minoDashboard_forgetOtpMatchToken");
            Cookies.set("mino_dashboard_accessToken", res?.data?.accessToken, {
                path: "/",
                expires: 365,
                secure: false,
            });
            form.reset();
            router("/", { replace: true });
        } else if (res?.statusCode === 200 && res?.data?.user?.role !== "admin") {
            form.reset();
            toast.error("Access Denied", {
                duration: 2000,
            });
        }
    };

    return (
        <div className="text-base-color">
            <Container>
                <div className=" min-h-screen flex justify-center items-center">
                    <div className="w-full max-w-150 mx-auto bg-highlight-color p-6 rounded-2xl">
                        {/* -------- Sign In Page Header ------------ */}
                        <div className="flex flex-col justify-center items-center">
                            <div className="text-center mt-5 mb-8">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-secondary-color">
                                    Welcome back!
                                </h1>
                                <h4 className="text-sm sm:text-base lg:text-lg text-secondary-color">
                                    Enter your details and login to your account.
                                </h4>
                            </div>
                        </div>
                        <form onSubmit={form.handleSubmit(onFinish)}>
                            <FieldGroup>
                                <FormInput prefix={<MdOutlineEmail size={20} />} control={form.control} name="email" label="Email" placeholder="Enter your email" />

                                <FormPassword
                                    prefix={<MdPassword size={20} />}
                                    control={form.control}
                                    name="password"
                                    label="Password"
                                    placeholder="Enter your password"
                                />


                                <Button className="py-5 text-base cursor-pointer" type="submit">Sign in</Button>
                            </FieldGroup>
                        </form>
                        <div className="flex justify-center items-center mt-10 mb-5">

                            <Link
                                to="/forgot-password"
                                className="text!-base-color underline! font-bold"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};
export default SignIn;
