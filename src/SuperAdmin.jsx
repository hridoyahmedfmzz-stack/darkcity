import AdminControl from "./AdminControl";

export default function SuperAdmin(){

  return(

    <div className="
    min-h-screen
    bg-black
    text-white
    p-6">

      <div className="
      bg-zinc-900
      rounded-3xl
      p-8
      border
      border-red-600">

        <h1 className="
        text-5xl
        font-black
        text-red-500
        mb-3">

          👑 SUPER ADMIN

        </h1>

        <p className="
        text-gray-400
        mb-8">

          Manage Users,
          Roles,
          Premium Access
          and System Controls

        </p>

        <AdminControl />

      </div>

    </div>

  );
}