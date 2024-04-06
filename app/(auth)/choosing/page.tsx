// components/ChoosingPage.js

import Link from "next/link";

const ChoosingPage = () => {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="head-text">Выберите вид аккаунта</h1>
      <div className="flex md:flex-row flex-col gap-8 items-center">
        <Link href="/choosing/onboarding-individual">
          <div className="w-full flex flex-col items-center justify-center bg-white p-6 rounded-md cursor-pointer">
            <img
              src="/assets/individual.svg"
              alt="Individual"
              className="w-40 h-40 mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">Индивидуальный</h2>
            <p className="text-sm">
              Зарегайтесь как пользователь и найдите стажировку!
            </p>
          </div>
        </Link>
        <Link href="/choosing/onboarding-team">
          <div className="w-full flex flex-col items-center justify-center bg-red-100 p-6 rounded-md cursor-pointer">
            <img src="/assets/team.svg" alt="Team" className="w-40 h-40 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Командный</h2>
            <p className="text-sm">
              Зарегистрируйтесь как команда и найдите подходящих людей!
            </p>
          </div>
        </Link>
      </div>
      <div className="h-32"></div>
    </div>
  );
};

export default ChoosingPage;
