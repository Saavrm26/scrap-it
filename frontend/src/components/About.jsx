import React from "react";

const About = () => {
  return (
    <div className="par w-full mx-auto gap-4 mt-[5rem] h-[40rem] p-5">
      <h2
        className="child text-slate-700 text-5xl font-bold text-center mt-5"
        style={{ opacity: 1, zIndex: 1 }}
      >
        About
      </h2>
      <div className="flex h-[30rem] w-full gap-10 px-5 justify-center items-center">
        <div className="flex-auto h-[20rem] w-[40px] bg-slate-200 rounded-xl hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl justify-center items-center">
          <p className="flex-auto text-3xl text-slate-700 px-5 py-3 mx-auto font-100 ">
            Description
          </p>
          <div className="flex-auto w-[52rem] h-[15rem] bg-white mx-auto my-auto shadow-lg rounded-lg p-5 text-xl font-sans text-slate-800">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate
            quia minima illum eaque voluptatibus repellendus consectetur hic
            quidem, odit rem atque a dolorem iusto enim sit facere assumenda
            architecto quaerat, reprehenderit iste odio rerum delectus soluta
            libero. Similique nihil facilis ipsam nesciunt fugit maiores, rem
            saepe. Quae sunt quam impedit. Lorem ipsum dolor, sit amet
            consectetur adipisicing elit. Inventore, reprehenderit.
          </div>
        </div>
        <div className="flex-auto h-[20rem] w-[40px] bg-slate-200 rounded-xl hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl justify-center items-center">
          <p className="flex-auto text-3xl text-slate-700 px-5 py-3 mx-auto font-100 ">
            How does it work?
          </p>
          <div className="flex-auto w-[52rem] h-[15rem] bg-white mx-auto my-auto shadow-lg rounded-lg p-5 text-xl font-sans text-slate-800">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit hic
            placeat veritatis assumenda id minus adipisci aspernatur, molestiae
            voluptas. Dicta odit magnam laborum, iste harum consequatur animi
            consequuntur voluptatibus sunt doloribus obcaecati dolore architecto
            impedit sint, dolorum eligendi quis nam facere minus beatae autem
            vel doloremque quasi! Alias, nam explicabo!
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
