"""
专业与特质映射文本转换器
将文本格式的专业与特质映射转换为Python字典
"""


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

    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # 跳过空行
        if not line:
            i += 1
            continue

        # 检查是否是新专业行
        if not line.startswith("、") and "、" not in line and i + 1 < len(lines):
            # 处理专业名称（如果有括号标注数量，去掉它）
            if "（" in line:
                major_name = line.split("（")[0].strip()
            else:
                major_name = line

            # 下一行应该是特质列表
            i += 1
            traits_line = lines[i].strip()
            traits = [trait.strip() for trait in traits_line.split("、")]

            # 添加到字典
            majors_traits[major_name] = traits

        i += 1

    return majors_traits


def generate_python_file(majors_dict, output_file):
    """
    生成Python字典文件

    Args:
        majors_dict: 专业与特质的映射字典
        output_file: 输出文件路径
    """
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("# 专业与能力特质映射字典\n\n")
        f.write("majors_traits_physics = {\n")

        for major, traits in majors_dict.items():
            traits_str = ", ".join([f'"{trait}"' for trait in traits])
            f.write(f'    "{major}": [{traits_str}],\n')

        f.write("}\n")

    print(f"已生成Python字典文件: {output_file}")


if __name__ == "__main__":
    input_file = "/Users/tony/Desktop/program/code/relation_database/mapping_physics.txt"
    output_file = "/Users/tony/Desktop/program/code/relation_database/majors_traits.py"
    majors_dict = parse_mapping_file(input_file)
    generate_python_file(majors_dict, output_file)
