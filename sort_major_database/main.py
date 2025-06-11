import pandas as pd

sort_major_physics = pd.read_excel("sort_major.xlsx",sheet_name="physics")
sort_major_history = pd.read_excel("sort_major.xlsx",sheet_name="historys")

major_physics_priority = {}
major_history_priority = {}
for index, row in sort_major_physics.iterrows():
    major_physics_priority[row['专业名称']] = row['总计划人数']

for index, row in sort_major_history.iterrows():
    major_history_priority[row['专业名称']] = row['总计划人数']

# 将两个字典按值从大到小排序

sorted_physics = sorted(major_physics_priority.items(), key=lambda x: x[1], reverse=True)
sorted_history = sorted(major_history_priority.items(), key=lambda x: x[1], reverse=True)

# 转化为json格式的字典
import json
physics_json = json.dumps(dict(sorted_physics), ensure_ascii=False, indent=4)
history_json = json.dumps(dict(sorted_history), ensure_ascii=False, indent=4)
# 写入文件
with open("physics.json", "w", encoding="utf-8") as f:
    f.write(physics_json)
with open("history.json", "w", encoding="utf-8") as f:
    f.write(history_json)