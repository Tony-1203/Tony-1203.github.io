test = "A.把要做的不同工作依次列出，B.马上动工"

def removeComma(string: str):
    if string.endswith(',') or string.endswith('，'):
        return string[:-1]
    
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
    return option_A.strip(), option_B.strip()

print(extractOption(test))