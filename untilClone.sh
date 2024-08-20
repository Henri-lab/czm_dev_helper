#!/bin/bash

# 定义远程仓库url

url="https://github.com/Henri-lab/openLayer-weather.git"


# 循环直到git push成功
until git clone "$url"; do
    echo "Git clone failed, retrying in 1 seconds..."
    sleep 1
done

echo "Git clone succeeded."

# chmod +x untilClone.sh
# ./untilClone.sh

# chmod +x ../../untilClone.sh
# ../../untilClone.sh