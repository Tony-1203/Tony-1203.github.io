import pandas as pd
from majors_traits_history import majors_traits_history
from majors_traits_physics import majors_traits_physics
df = pd.read_excel('data.xlsx')

major_names = []

# for major in majors_traits_physics:
#     major_names.append(major)
# for major in majors_traits_history:
#     major_names.append(major)

for major_physics in majors_traits_physics:
    for major_history in majors_traits_history:
        if major_physics == major_history:
            print(major_history+"fuck")