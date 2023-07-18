class Animal:
    def __init__(self,walk,eat):
        self.eat =  eat
        self.walk = walk
        print("contructor is running on it own")
    def __walk(self):
        return self.walk

goat =  Animal("crawl","yam")
print(goat.__walk())
    