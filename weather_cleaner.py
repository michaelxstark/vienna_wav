import pandas as pd
import numpy as np
import re


#create three files
# 1.) avg temp a year
# 2.) avg precipitation per month for last 20 years
# 3.) avg temp per month for 20 years
# 4.) num_heat and num_summer days a month


# 1.) avg temp a year

df = pd.read_csv('vie-bdl-ecl-wea-1872f.csv', sep=';')

df['T'].replace(',', '.', regex=True, inplace=True)

df['T'] = df['T'].astype('float')

df_avg_temp_year = pd.DataFrame(columns=['Year', 'AVG_TEMP'])

# getiing unique values for average per year
df_avg_temp_year['Year'] = df['REF_YEAR'].unique()

# shortening the df to only have fully recorded years
df_avg_temp_year = df_avg_temp_year[1:-1].reset_index()

df_avg_temp_year['index'] -= 1

df_avg_temp_year

# filling the avg with values

df = df[(df['REF_YEAR'] != 1872) & (df['REF_YEAR'] != 2023)]

mean_temp = df.groupby(['REF_YEAR']).mean()['T'].reset_index()

mean_temp

df_avg_temp_year['AVG_TEMP'] = mean_temp['T'].round(2)

df_avg_temp_year['AVG_TEMP'].max()


#write to csv

df_avg_temp_year.to_csv('avg_temp_year.csv')


# 2.) avg precipitation per month for last 20 years

df_2 = pd.read_csv('vie-bdl-ecl-wea-1872f.csv', sep=';')


df_precp_sum = pd.DataFrame(columns=['Date', 'Precp_Sum'])

df_2_short = df_2[df_2['REF_YEAR'] > 1979]

df_precp_sum['Date'] = df_2_short['REF_DATE']
df_precp_sum['Precp_Sum'] = df_2_short['PRECP_SUM']

df_precp_sum = df_precp_sum.reset_index()

df_precp_sum.pop('index')

#write to csv
df_precp_sum.to_csv('sum_precipitation_from1980.csv')


# 3.) avg temp per month for 20 years -- later: beat where avg temp is devided into 4/5 sections


df_avg_temp_month_from1980 = pd.DataFrame(columns=['Date', 'Temp'])

df_avg_temp_month_from1980['Date'] = df_2_short['REF_DATE']


df_avg_temp_month_from1980['Temp'] = df_2_short['T']

df_avg_temp_month_from1980 = df_avg_temp_month_from1980.reset_index()

df_avg_temp_month_from1980.pop('index')

#write to csv

df_avg_temp_month_from1980.to_csv('df_avg_temp_month_from1980.csv')




# 4.) num_heat and num_summer days a month - later use: one sound clicking through
# when heat days, then other sound. number of heat days determines the height of tone.


df_num_summer_from1980 = pd.DataFrame(columns=['Date', 'Summer'])

df_num_summer_from1980['Date'] = df_2_short['REF_DATE']

df_num_summer_from1980['Summer'] = df_2_short['NUM_SUMMER']

df_num_summer_from1980 = df_num_summer_from1980.reset_index()

df_num_summer_from1980.pop('index')

df_num_summer_from1980.to_csv('df_num_summer_from1980.csv')
