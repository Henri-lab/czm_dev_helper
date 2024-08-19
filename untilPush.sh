#!/bin/bash

# 定义远程仓库名称，默认为origin
REMOTE="origin"

# 定义分支名称
BRANCH="master"

# 循环直到git push成功
until git push -u "$REMOTE" "$BRANCH"; do
    echo "Git push failed, retrying in 5 seconds..."
    sleep 5
done

echo "Git push succeeded."

# chmod +x untilPush.sh
# ./untilPush.sh