import { useState } from "react";
import Createmodal from "../../Components/Post/Createmodal";
import Header from "../../Components/Sharedd/Header";

const CreatepostPage = () => {
  const [loading, setLoading] = useState(false);


  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </>
    );
  }


  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto p-4 md:p-6">
          <h1 className="text-2xl font-bold mb-6">Create Post</h1>
          <Createmodal />
        </div>
      </main>
    </>
  );
};

export default CreatepostPage;
