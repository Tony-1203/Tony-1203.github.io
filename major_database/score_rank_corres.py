import pandas as pd
import json

physics_2023 = pd.read_excel("score_rank_corres.xlsx", sheet_name="2023physics")
score_rank_2023physics = dict(zip(physics_2023["分数"], physics_2023["位次"]))

physics_2022 = pd.read_excel("score_rank_corres.xlsx", sheet_name="2022physics")
score_rank_2022physics = dict(zip(physics_2022["分数"], physics_2022["位次"]))

physics_2021 = pd.read_excel("score_rank_corres.xlsx", sheet_name="2021physics")
score_rank_2021physics = dict(zip(physics_2021["分数"], physics_2021["位次"]))

history_2023 = pd.read_excel("score_rank_corres.xlsx", sheet_name="2023history")
score_rank_2023history = dict(zip(history_2023["分数"], history_2023["位次"]))

history_2022 = pd.read_excel("score_rank_corres.xlsx", sheet_name="2022history")
score_rank_2022history = dict(zip(history_2022["分数"], history_2022["位次"]))

history_2021 = pd.read_excel("score_rank_corres.xlsx", sheet_name="2021history")
score_rank_2021history = dict(zip(history_2021["分数"], history_2021["位次"]))

# 将字典数据存储到新的JS文件
output_js_filepath = "/Users/tony/Desktop/Tony/College/Tony_Programming/HTML_Work/Tony-1203.github.io/major_database/score_rank_data.js"

data_to_export = {
    "score_rank_2023physics": score_rank_2023physics,
    "score_rank_2022physics": score_rank_2022physics,
    "score_rank_2021physics": score_rank_2021physics,
    "score_rank_2023history": score_rank_2023history,
    "score_rank_2022history": score_rank_2022history,
    "score_rank_2021history": score_rank_2021history,
}

with open(output_js_filepath, 'w', encoding='utf-8') as js_file:
    js_file.write(f"// filepath: {output_js_filepath}\n")
    for var_name, data_dict in data_to_export.items():
        # 将Python字典的键转换为字符串，因为JSON对象的键必须是字符串
        # 对于这些特定的字典，键已经是数字，json.dumps会自动处理
        # 但如果键是其他非字符串类型，可能需要显式转换
        # score_rank 字典的键（分数）是数字，json.dumps 会将它们转换为字符串键
        json_string = json.dumps(data_dict, ensure_ascii=False, indent=None) # indent=None 使得输出更紧凑
        js_file.write(f"const {var_name} = {json_string};\n")

print(f"数据已成功写入到: {output_js_filepath}")