# 多repo同步推送脚本

# 定义远程仓库名称，默认为origin
REMOTE="origin"
REMOTE2='gitee'

# 定义分支名称
BRANCH="master"
BRANCH2='master'

#gitee repo
until git push -u "$REMOTE2" "$BRANCH2";
do
    echo "Gitee push failed, retrying in 1 second..."
    sleep 1
done
echo "Gitee push succeeded."

#github repo 主要是GitHub推送网络问题很严重
# 循环直到git push成功
until git push -u "$REMOTE" "$BRANCH"; 
do
    echo "GitHub push failed, retrying in 1 second..."
    sleep 1
done

echo "GitHub push succeeded."

# chmod +x untilPush.sh
# ./untilPush.sh