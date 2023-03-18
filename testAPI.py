import requests
text = '''Hi! How are you? I am good. My name is Anurag. Great to meet you!'''
r = requests.post(url='https://kabita-choudhary-summary.hf.space/run/predict', json={"data": [text]})
print(r.json()['data'][0])
