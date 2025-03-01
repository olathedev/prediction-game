import Question from "../../components/Question"
import mockQuestions from "../../constants/mockQuestions"

const HomePage = () => {
  return (
    <div className="w-full flex flex-col space-y-4 py-10 ">
      { mockQuestions.map((question, index) => (
        <Question key={index} question={question.question} />
      )
       )}
    </div>
  )
}

export default HomePage
