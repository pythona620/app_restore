from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="app_backup_restore",
    version="0.0.1",
    author="Prasad",
    author_email="pythona620@gmail.com",
    description="Frappe app for partial backup and restore",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/prasad/app_backup_restore",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Framework :: Frappe",
    ],
    python_requires=">=3.10",
    install_requires=[
        "frappe",
    ],
    include_package_data=True,
    zip_safe=False,
)
