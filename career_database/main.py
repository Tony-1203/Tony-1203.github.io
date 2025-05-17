class Question:
    def __init__(self, question, option_A, dimension_A, option_B, dimension_B):
        self.question = question
        self.option_A = option_A
        self.option_B = option_B
        self.dimension_A = dimension_A
        self.dimension_B = dimension_B

def printJson(questions):
    for question in questions:
        print("{")
        print('"question": "', question.question, '",')
        print('  "options": [')
        print(
            '    { "text": "',
            question.option_A,
            '", "dimension":"',
            question.dimension_A,
            '"},',
        )
        print(
            '    { "text": "',
            question.option_B,
            '", "dimension":"',
            question.dimension_B,
            '"}',
        )
        print("  ]")
        print("},")

def main(file_path):
    questions = []
    with open(file_path, 'r', encoding='utf-8') as file:
        index = 0
        lines = file.readlines()
        for line in lines:
            index += 1
            option_A = '是'
            option_B = '否'
            dimension_B = 'X'
            if index % 6 == 1:
                dimension_A = 'R'
            elif index % 6 == 2:
                dimension_A = 'I'
            elif index % 6 == 3:
                dimension_A = 'A'
            elif index % 6 == 4:
                dimension_A = 'S'
            elif index % 6 == 5:
                dimension_A = 'E'
            elif index % 6 == 0:
                dimension_A = 'C'
            question = Question(line.split('.')[1].strip(), option_A, dimension_A, option_B, dimension_B)
            questions.append(question)
    printJson(questions)

if __name__ == "__main__":
    file_path = "data.txt" 
    main(file_path)