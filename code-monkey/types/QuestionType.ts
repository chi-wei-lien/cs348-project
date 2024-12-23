interface QuestionType {
  name: string;
  link: string;
  posted_by: string;
  posted_by_id: number;
  posted_time: Date;
  q_id: number;
  is_completed: boolean;
}

export default QuestionType;
