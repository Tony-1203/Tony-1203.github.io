import pandas as pd
from history.majors_traits_history import majors_traits_history
from physics.majors_traits_physics import majors_traits_physics

df = pd.read_excel(
    "/Users/tony/Desktop/program/code/relation_database/relation.xlsx", header=0
)

personality_keywords = {}

for _, row in df.iterrows():
    combination = row[0]  # MBTI+Holland组合，如"ENFJ+A"
    keywords = [keyword.strip() for keyword in row[1].split(",")]
    personality_keywords[combination] = keywords

# def generate_python_file(majors_dict, output_file):
#     """
#     生成Python字典文件

#     Args:
#         majors_dict: 专业与特质的映射字典
#         output_file: 输出文件路径
#     """
#     with open(output_file, "w", encoding="utf-8") as f:
#         f.write("# 专业与能力特质映射字典\n\n")
#         f.write("majors_traits_physics = {\n")

#         for major, traits in majors_dict.items():
#             traits_str = ", ".join([f'"{trait}"' for trait in traits])
#             f.write(f'    "{major}": [{traits_str}],\n')

#         f.write("}\n")

#     print(f"已生成Python字典文件: {output_file}")

# generate_python_file(personality_keywords, "personality_keywords.py")

def find_characteristics(mbti, holland, choice):
    characteristics = set()  # 改为使用集合而不是列表
    for char in holland:
        combination = f"{mbti}+{char}"
        if combination in personality_keywords:
            keywords = personality_keywords[combination]
            characteristics.update(keywords)  # 使用update添加多个元素到集合
        else:
            print(f"未找到{combination}的相关关键词")
    return characteristics


def find_career(chacteristics, choice):
    if choice == "history":
        mapping = majors_traits_history.copy()  # 创建副本以避免修改原字典
        # 为mapping中的每一个专业计算符合的比例，创建一个字典保存
        results = {}
        for major, traits in mapping.items():
            match_count = len(
                set(traits) & chacteristics
            )  # 不需要再对chacteristics调用set()
            total_count = len(traits)
            ratio = match_count / total_count if total_count > 0 else 0
            results[major] = ratio
        # 按照比例从高到低排序
        sorted_mapping = sorted(results.items(), key=lambda x: x[1], reverse=True)
        # 取出前100个专业
        top_10 = sorted_mapping
        return top_10
    elif choice == "physics":
        mapping = majors_traits_physics.copy()  # 创建副本以避免修改原字典
        # 为mapping中的每一个专业计算符合的比例，创建一个字典保存
        results = {}
        for major, traits in mapping.items():
            match_count = len(
                set(traits) & chacteristics
            )  # 不需要再对chacteristics调用set()
            total_count = len(traits)
            ratio = match_count / total_count if total_count > 0 else 0
            results[major] = ratio
        # 按照比例从高到低排序
        sorted_mapping = sorted(results.items(), key=lambda x: x[1], reverse=True)
        # 取出前100个专业
        top_10 = sorted_mapping
        return top_10


def main():
    mbti = input("请输入您的MBTI类型（如ENFJ）：")
    holland = input("请输入您的Holland类型（如IRA）：")
    choice = input("请输入您选择的专业领域（history/physics）：")

    characteristics = find_characteristics(mbti, holland, choice)
    print(f"根据您的MBTI和Holland类型，推荐的特质有：{characteristics}")

    top_majors = find_career(characteristics, choice)
    print(f"根据您的特质，推荐的专业有：{top_majors}")


if __name__ == "__main__":
    main()
