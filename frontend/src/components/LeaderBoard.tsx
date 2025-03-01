const LeaderBoard = () => {
   const users = [
     { rank: 1, name: "John Doe", points: 1000, avatar: "https://i.pravatar.cc/50?img=1" },
     { rank: 2, name: "Jane Doe", points: 900, avatar: "https://i.pravatar.cc/50?img=2" },
     { rank: 3, name: "Mike Smith", points: 800, avatar: "https://i.pravatar.cc/50?img=3" },
   ];
 
   return (
     <div className="w-full bg-[#0f1420] flex justify-center p-6">
       <div className="w-full max-w-3xl bg-[#080c14] text-white rounded-2xl shadow-lg p-6">
         <h1 className="text-center text-3xl font-bold mb-6">🏆 LeaderBoard</h1>
         <table className="w-full text-white border-separate border-spacing-y-3">
           <thead>
             <tr className="text-left text-lg">
               <th className="px-4 py-2">Rank</th>
               <th className="px-4 py-2">User</th>
               <th className="px-4 py-2">Points</th>
             </tr>
           </thead>
           <tbody>
             {users.map((user, index) => (
               <tr key={index} className="bg-gray-800 rounded-lg">
                 <td className="px-4 py-3 font-bold">#{user.rank}</td>
                 <td className="px-4 py-3 flex items-center gap-3">
                   <img
                     src={user.avatar}
                     alt="avatar"
                     className="w-10 h-10 rounded-full border-2 border-white"
                   />
                   {user.name}
                 </td>
                 <td className="px-4 py-3 text-lg font-semibold">{user.points}</td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     </div>
   );
 };
 
 export default LeaderBoard;
 