import pandas as pd

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