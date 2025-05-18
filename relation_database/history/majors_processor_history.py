def parse_mapping_file(file_path):
    """
    解析专业与特质映射文本文件，转换为Python字典

    Args:
        file_path: 映射文本文件路径

    Returns:
        dict: 专业与特质的映射字典
    """
    majors_traits = {}
    current_major = None
    traits = []

    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # 跳过空行
        if not line:
            i += 1
            continue

        # 检查是否是专业行（包含括号和关键词）
        if "（" in line and "关键词" in line:
            # 如果已经有一个专业在处理中，先保存它
            if current_major is not None:
                majors_traits[current_major] = traits

            # 提取新专业名称，去除括号说明
            current_major = line.split("（")[0].strip()
            traits = []

        # 检查是否是特质行
        elif line.startswith("•") and current_major is not None:
            # 提取特质，去除前缀 "•"
            trait = line.replace("•", "").strip()
            traits.append(trait)

            # 检查是否是最后一个特质
            if i == len(lines) - 1 or (
                "（" in lines[i + 1] and "关键词" in lines[i + 1]
            ):
                majors_traits[current_major] = traits

        i += 1

    # 保存最后一个专业的特质
    if current_major is not None and traits:
        majors_traits[current_major] = traits

    return majors_traits


def generate_python_file(majors_dict, output_file):
    """
    生成Python字典文件

    Args:
        majors_dict: 专业与特质的映射字典
        output_file: 输出文件路径
    """
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("# 文科专业与能力特质映射字典\n\n")
        f.write("majors_traits_history = {\n")

        for major, traits in majors_dict.items():
            traits_str = ", ".join([f'"{trait}"' for trait in traits])
            f.write(f'    "{major}": [{traits_str}],\n')

        f.write("}\n")

    print(f"已生成Python字典文件: {output_file}")


if __name__ == "__main__":
    input_file = "mapping_history.txt"
    output_file = "majors_traits_history.py"
    majors_dict = parse_mapping_file(input_file)
    generate_python_file(majors_dict, output_file)
