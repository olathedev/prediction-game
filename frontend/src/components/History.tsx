const History = () => {
   const predictions = [
     { question: "Will Bitcoin hit $50k this month?", answer: "Yes", correct: true },
     { question: "Will Ethereum outperform Bitcoin?", answer: "No", correct: false },
     { question: "Will Solana reach top 3?", answer: "Yes", correct: true },
   ];
 
   return (
     <div className="bg-[#080c14] bg-opacity-80 backdrop-blur-xl p-6 rounded-xl flex flex-col text-white">
       <h2 className="text-gray-300 text-lg font-semibold">📜 Prediction History</h2>
       <div className="space-y-4">
         {predictions.map((item, index) => (
           <div key={index} className="bg-gray-900 p-4 rounded-lg flex justify-between items-center">
             <div>
               <p className="text-sm text-gray-400">{item.question}</p>
               <p className="text-sm">Your Answer: <span className="font-semibold text-purple-400">{item.answer}</span></p>
             </div>
             <span
               className={`px-3 py-1 rounded-full text-xs font-semibold ${item.correct ? 'bg-green-500' : 'bg-red-500'}`}
             >
               {item.correct ? "Correct ✅" : "Wrong ❌"}
             </span>
           </div>
         ))}
       </div>
     </div>
   );
 };
 
 export default History;
 