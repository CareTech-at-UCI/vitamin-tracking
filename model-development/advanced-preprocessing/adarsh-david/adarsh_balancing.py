import os
import random
from collections import defaultdict

random.seed(42)

DATASET_PATH = dataset.location

splits = ["train", "valid", "test"]

# total per class
class_instances = defaultdict(list)

for split in splits:
    labels_dir = os.path.join(DATASET_PATH, split, "labels")
    for file in os.listdir(labels_dir):
        label_path = os.path.join(labels_dir, file)
        with open(label_path, "r") as f:
            lines = f.readlines()
            for idx, line in enumerate(lines):
                class_id = int(line.split()[0])
                class_instances[class_id].append((label_path, idx))

# min class size
min_class_size = min(len(v) for v in class_instances.values())
print("Minimum class size:", min_class_size)

# random for splits
selected_instances = set()

for class_id, instances in class_instances.items():
    chosen = random.sample(instances, min_class_size)
    selected_instances.update(chosen)

# labels
for split in splits:
    labels_dir = os.path.join(DATASET_PATH, split, "labels")
    images_dir = os.path.join(DATASET_PATH, split, "images")

    for file in os.listdir(labels_dir):
        label_path = os.path.join(labels_dir, file)

        with open(label_path, "r") as f:
            lines = f.readlines()

        new_lines = []
        for idx, line in enumerate(lines):
            if (label_path, idx) in selected_instances:
                new_lines.append(line)

        if new_lines:
            with open(label_path, "w") as f:
                f.writelines(new_lines)
        else:
            os.remove(label_path)
            image_name = file.replace(".txt", ".jpg")
            image_path = os.path.join(images_dir, image_name)
            if os.path.exists(image_path):
                os.remove(image_path)

print("Balancing complete.")