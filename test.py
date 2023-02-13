from operations import read_blob


drawing = open("tests/fixtures/download.jpg", 'rb').read()

print(type(drawing))



read_blob(1)
