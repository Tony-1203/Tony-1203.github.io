import pandas as pd


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

def removeComma(string: str):
    if string.endswith(',') or string.endswith('，'):
        string = string[:-1]
    if string.startswith('.') or string.startswith(',') or string.startswith('，'):
        string = string[1:]
    return string

def extractOption(options):
    option_A = ""
    option_B = ""
    is_optionA = True
    is_optionB = False
    for char in options:
        if char == 'B':
            is_optionB = True
            continue
        if char != 'A' and not is_optionB:
            option_A += char
        if is_optionB:
            option_B += char
    return removeComma(option_A.strip()), removeComma(option_B.strip())


def main_category1(file_path):
    questions = []
    df = pd.read_excel(file_path, header=None)
    for i in range(int(len(df) / 2)):
        dimension_A, dimension_B = "A", "A"
        question = df.iloc[2 * i + 1][1]
        for j in range(3, df.shape[1]):
            if df.iloc[2 * i + 1][j] == "v":
                dimension_A = df.iloc[0][j]
        for j in range(3, df.shape[1]):
            if df.iloc[2 * i + 2][j] == "v":
                dimension_B = df.iloc[0][j]
        # option_A = df.iloc[2 * i + 2][1].split(",")[0].strip()[1:]
        # option_B = df.iloc[2 * i + 2][1].split(",")[1].strip()[1:]
        option_A, option_B = extractOption(df.iloc[2 * i + 2][1].strip())
        questions.append(
            Question(question, option_A, dimension_A, option_B, dimension_B)
        )
    printJson(questions)


def main_category2(file_path):
    questions = []
    df = pd.read_excel(file_path, header=None)
    dimension_A, dimension_B = "",""
    for i in range(1, df.shape[0]):
        if i % 2 == 1:
            # print(df.iloc[i][1])
            option_A, option_B = extractOption(df.iloc[i][1])
            for j in range(3, df.shape[1]):
                if df.iloc[i][j] == 'v':
                    dimension_A = df.iloc[0][j]
        else:
            for j in range(3, df.shape[1]):
                if df.iloc[i][j] == 'v':
                    dimension_B = df.iloc[0][j]
            questions.append(Question("",option_A, dimension_A, option_B, dimension_B))
    printJson(questions)

def main_category3(file_path):
    main_category1(file_path)

def main_category4(file_path):
    main_category2(file_path)


if __name__ == "__main__": 
    file_path = "/Users/tony/Desktop/program/code/mbti_database/Category4.xlsx"
    main_category4(file_path)
