import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="min-h-screen bg-[#faf3e4] px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center sm:min-h-[calc(100vh-6rem)]">
        <div
          className="
            w-full max-w-[560px]
            rounded-[24px]
            border border-[#eadfc9]
            bg-[#fffdf9]
            px-6 py-8
            shadow-[0_18px_50px_rgba(55,42,25,0.08)]
            sm:px-10 sm:py-10
            md:px-12 md:py-11
          "
        >
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
