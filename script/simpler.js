window.onload = () => {
    const projects = orderBy(data, "type");
    const main = document.querySelector('main');
    console.log('works', projects);
    Object.keys(projects)
      .forEach((type) => {
        const title = document.createElement('h2');
        title.innerText = type;
        main.appendChild(title);
        const grid = document.createElement('div');
        grid.classList.add('grid');

        projects[type].forEach((project) => {
            const template = document.querySelector('template');
          
            const projectPage = template.content.cloneNode(true);
          
            const name = projectPage.querySelector('[name="name"]');
            const description = projectPage.querySelector('[name="description"]');
            const technologies = projectPage.querySelector('[name="technologies"]');
            const link = projectPage.querySelector('[name="link"]');
            const images = projectPage.querySelector('[name="images"]');
          
            name.innerText = project.name;
            description.innerText = project.description;
            technologies.innerText = project.technologies.join(", ");
            if (project.link) {
              link.querySelector('a').href = project.link;
              link.querySelector('a').innerText = project.link;
            } else {
              link.remove();
            }
            console.log(link);
            images.innerHTML = project.images.map((image) => `<img src="images/${image}"/>`).join('');
            grid.appendChild(projectPage);
        });
        main.appendChild(grid);
      });
};

function orderBy(array, key) {
    let result = {};
    for (x of array) {
      if (x[key] in result) {
        result[x[key]].push(x);
      } else {
        result[x[key]] = [x];
      }
    }
    return result;
  }