import pandas as pd
from score_rank_corres import (
    score_rank_2023physics,
    score_rank_2022physics,
    score_rank_2021physics,
    score_rank_2023history,
    score_rank_2022history,
    score_rank_2021history
)

def load_data(file_path):
    try:
        data = pd.read_excel(file_path)
        return data
    except Exception as e:
        print(f"Error loading data: {e}")
        return None

def build_major_database(data):
    major_db = {}
    for _, row in data.iterrows():
        major = str(row[1]).strip()
        university = str(row[0]).strip()
        score_2023 = str(row[3]).strip()
        score_2022 = str(row[6]).strip()
        score_2021 = str(row[9]).strip()
        if major not in major_db:
            major_db[major] = {}
        
        if university not in major_db[major]:
            major_db[major][university] = {}
        
        major_db[major][university]['2023'] = 'nan'
        major_db[major][university]['2022'] = 'nan'
        major_db[major][university]['2021'] = 'nan'
        if score_2023 != 'nan':
            if score_2023 < major_db[major][university]['2023'] or major_db[major][university]['2023'] == 'nan':
                major_db[major][university]['2023'] = score_2023
        if score_2022 != 'nan':
            if score_2022 < major_db[major][university]['2022'] or major_db[major][university]['2022'] == 'nan':
                major_db[major][university]['2022'] = score_2022
        if score_2021 != 'nan':
            if score_2021 < major_db[major][university]['2021'] or major_db[major][university]['2021'] == 'nan':
                major_db[major][university]['2021'] = score_2021
    return major_db

def convert_to_json(major_db, career):
    """
    Convert the major database to a JSON-like structure.
    对每一年内部的university按分数从高到低排序，nan排最后。
    """
    formatted_data = {}
    for major, universities in major_db.items():
        formatted_data[major] = {
            "schools": list(universities.keys()),
            "scores": {
                "2023": {},
                "2022": {},
                "2021": {}
            },
            "description": ""
        }
        for year in ["2023", "2022", "2021"]:
            # 收集所有学校及其分数
            year_scores = []
            for university, years in universities.items():
                score = years[year]
                year_scores.append((university, score))
            # 排序：分数高的在前，nan在最后
            year_scores_sorted = sorted(
                year_scores,
                key=lambda item: (item[1] == 'nan', -(float(item[1])) if item[1] != 'nan' else 0)
            )
            # 填充排序后的数据
            for university, score in year_scores_sorted:
                if score != 'nan':
                    if career == "physics":
                        if year == "2023":
                            rank = score_rank_2023physics.get(int(float(score)))
                            if rank is None:
                                rank = next(iter(score_rank_2023physics.values()))
                            formatted_data[major]["scores"][year][university] = f"{score}分(位次：{rank})"
                        elif year == "2022":
                            rank = score_rank_2022physics.get(int(float(score)))
                            if rank is None:
                                rank = next(iter(score_rank_2022physics.values()))
                            formatted_data[major]["scores"][year][university] = f"{score}分(位次：{rank})"
                        elif year == "2021":
                            rank = score_rank_2021physics.get(int(float(score)))
                            if rank is None:
                                rank = next(iter(score_rank_2021physics.values()))
                            formatted_data[major]["scores"][year][university] = f"{score}分(位次：{rank})"
                    elif career == "history":
                        if year == "2023":
                            rank = score_rank_2023history.get(int(float(score)))
                            if rank is None:
                                rank = next(iter(score_rank_2023history.values()))
                            formatted_data[major]["scores"][year][university] = f"{score}分(位次：{rank})"
                        elif year == "2022":
                            rank = score_rank_2022history.get(int(float(score)))
                            if rank is None:
                                rank = next(iter(score_rank_2022history.values()))
                            formatted_data[major]["scores"][year][university] = f"{score}分(位次：{rank})"
                        elif year == "2021":
                            rank = score_rank_2021history.get(int(float(score)))
                            if rank is None:
                                rank = next(iter(score_rank_2021history.values()))
                            formatted_data[major]["scores"][year][university] = f"{score}分(位次：{rank})"
                    else:
                        formatted_data[major]["scores"][year][university] = f"{score}分"
                else:
                    formatted_data[major]["scores"][year][university] = "无数据"
    return formatted_data

def save_to_json(major_db, output_file, career):
    """
    Save the major database to a JSON file.
    """
    import json
    formatted_data = convert_to_json(major_db, career)
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(formatted_data, f, ensure_ascii=False, indent=4)

def main():
    file_path = 'history.xlsx'
    career = file_path.split('.')[0]
    data = load_data(file_path)
    if data is not None:
        major_db = build_major_database(data)
        output_file = 'major_database_history.json'
        save_to_json(major_db, output_file, career)


if __name__ == "__main__":
    main()