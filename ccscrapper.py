import requests
from bs4 import BeautifulSoup
from sys import argv
import os
import pyprind

script,user=argv
base="https://www.codechef.com"
url = "https://www.codechef.com/users/"+user  
source = requests.get(url)
plain_text = source.text
soup =BeautifulSoup(plain_text,"lxml")
section = soup.findAll('section',{'class':'rating-data-section problems-solved'})
links = section[0].find_all('a')
for link in links:
	try:
		link_url=base+ link['href']
		name = link.string
		link_url=link_url+"?sort_by=All&sorting_order=asc&language=All&status=15&Submit=GO" 
		code=requests.get(link_url)
		plain=code.text
		sp=BeautifulSoup(plain,"lxml")
		ids=sp.findAll('td',{'width':'60'})
		try:
			sid=ids[0].string
		except:
			continue


		langs=sp.findAll('td',{'width':'70'})
		lang=langs[0].string
	

	

		if(lang.find('C++')>=0):
			lang='cpp'
		elif(lang.find('JAVA')>=0):
			lang='java'
		elif(lang.find('C')>=0):
			lang='c'
		else:
			lang='py'	

		code_plain_text_url=base+ "/viewplaintext/" +sid 
		code_file_data_source=requests.get(code_plain_text_url)
		code_file_data=code_file_data_source.text
		soup=BeautifulSoup(code_file_data,'lxml')
		code=soup.getText()
		newpath = './'+user #username
		if not os.path.exists(newpath):
			os.makedirs(newpath)
		name=name+"."+lang
		newpath=newpath+'/'+name
		f = open(newpath,'w')	
		f.write(code)
		f.close()
	except:
		continue
		