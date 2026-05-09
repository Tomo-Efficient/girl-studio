import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "bg-[#c4736e] hover:bg-[#b0635e] text-sm font-normal",
            card: "shadow-none border border-[#e8dfd5]",
            headerTitle: "text-[#2c2c2c] font-serif text-2xl",
            headerSubtitle: "text-[#8c8c8c] font-light",
            socialButtonsBlockButton: "border-[#e8dfd5] text-[#2c2c2c] font-light",
            dividerLine: "bg-[#e8dfd5]",
            dividerText: "text-[#8c8c8c]",
            formFieldLabel: "text-[#8c8c8c] text-xs",
            formFieldInput: "border-[#e8dfd5] focus:ring-[#c4736e]",
            footerActionLink: "text-[#c4736e] hover:text-[#b0635e]",
          },
        }}
      />
    </div>
  );
}
